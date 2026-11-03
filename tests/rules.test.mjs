import { initializeTestEnvironment, assertSucceeds as ok, assertFails as no } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'node:fs';
const B = 'artifacts/spc-fire-academy/public/data';
const env = await initializeTestEnvironment({ projectId: 'demo-spc', firestore: { rules: fs.readFileSync(new URL('../firestore.rules', import.meta.url),'utf8'), host:'127.0.0.1', port:8080 } });
let pass=0, fail=0; const results=[];
async function t(name, p){ try{ await p; pass++; results.push('PASS '+name);} catch(e){ fail++; results.push('FAIL '+name+' :: '+e.message.split('\n')[0]); } }
async function seed(withBoot=true){
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async c=>{ const d=c.firestore();
    if(withBoot) await setDoc(doc(d,B+'/config/bootstrap'),{done:true});
    const U=(uid,o)=>setDoc(doc(d,B+'/users/'+uid),{disabled:false,...o});
    await U('admin',{role:'admin',personId:'ADMIN'}); await U('inst',{role:'instructor',personId:'INST-07'});
    await U('instOff',{role:'instructor',personId:'INST-99',disabled:true});
    await U('stu',{role:'student',personId:'C-999'}); await U('stu2',{role:'student',personId:'C-101'});
    await setDoc(doc(d,B+'/users/legacy'),{role:'instructor',personId:'INST-01'});
    await U('stuOff',{role:'student',personId:'C-555',disabled:true});
    await setDoc(doc(d,B+'/evaluations/e1'),{id:'C-999',score:1}); await setDoc(doc(d,B+'/evaluations/e2'),{id:'C-101',score:2});
    await setDoc(doc(d,B+'/evaluations/e3'),{id:'C-555',score:3});
    await setDoc(doc(d,B+'/archives/a1'),{x:1}); await setDoc(doc(d,B+'/instructors/i1'),{n:'x'}); await setDoc(doc(d,B+'/candidates/c1'),{n:'y'});
    await setDoc(doc(d,B+'/directory/C-999'),{email:'c-999@spc.local'});
  });
}
const db = uid => uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();
await seed();
// --- signed out
let d=db(null);
await t('anon: read bootstrap', ok(getDoc(doc(d,B+'/config/bootstrap'))));
await t('anon: read directory', ok(getDoc(doc(d,B+'/directory/C-999'))));
await t('anon: write directory DENIED', no(setDoc(doc(d,B+'/directory/C-999'),{email:'evil@x'})));
await t('anon: overwrite bootstrap DENIED', no(setDoc(doc(d,B+'/config/bootstrap'),{done:false})));
await t('anon: delete bootstrap DENIED', no(deleteDoc(doc(d,B+'/config/bootstrap'))));
for (const p of ['users/stu','evaluations/e1','archives/a1','instructors/i1','candidates/c1']) {
  await t('anon: read '+p+' DENIED', no(getDoc(doc(d,B+'/'+p))));
  await t('anon: write '+p+' DENIED', no(setDoc(doc(d,B+'/'+p),{hack:1})));
}
await t('anon: create own admin profile after setup DENIED', no(setDoc(doc(d,B+'/users/x'),{role:'admin'})));
await t('anon: random path DENIED', no(setDoc(doc(d,'other/x'),{a:1})));
// --- signed in, no profile
d=db('nobody');
await t('no-profile: read evaluations DENIED', no(getDoc(doc(d,B+'/evaluations/e1'))));
await t('no-profile: self-create admin after setup DENIED', no(setDoc(doc(d,B+'/users/nobody'),{role:'admin'})));
await t('no-profile: self-create student DENIED', no(setDoc(doc(d,B+'/users/nobody'),{role:'student',personId:'C-1'})));
await t('no-profile: read roster DENIED', no(getDocs(collection(d,B+'/candidates'))));
// --- student
d=db('stu');
await t('student: read own profile', ok(getDoc(doc(d,B+'/users/stu'))));
await t('student: read other profile DENIED', no(getDoc(doc(d,B+'/users/stu2'))));
await t('student: list all profiles DENIED', no(getDocs(collection(d,B+'/users'))));
await t('student: promote self to admin DENIED', no(updateDoc(doc(d,B+'/users/stu'),{role:'admin'})));
await t('student: change own personId DENIED', no(updateDoc(doc(d,B+'/users/stu'),{personId:'C-101'})));
await t('student: delete own profile DENIED', no(deleteDoc(doc(d,B+'/users/stu'))));
await t('student: read own evaluation', ok(getDoc(doc(d,B+'/evaluations/e1'))));
await t('student: read other evaluation DENIED', no(getDoc(doc(d,B+'/evaluations/e2'))));
await t('student: query own evaluations', ok(getDocs(query(collection(d,B+'/evaluations'),where('id','==','C-999')))));
await t('student: query other student evaluations DENIED', no(getDocs(query(collection(d,B+'/evaluations'),where('id','==','C-101')))));
await t('student: list all evaluations DENIED', no(getDocs(collection(d,B+'/evaluations'))));
await t('student: create evaluation DENIED', no(setDoc(doc(d,B+'/evaluations/new'),{id:'C-999',score:100})));
await t('student: edit own evaluation DENIED', no(updateDoc(doc(d,B+'/evaluations/e1'),{score:100})));
await t('student: delete own evaluation DENIED', no(deleteDoc(doc(d,B+'/evaluations/e1'))));
await t('student: read roster (candidates) DENIED', no(getDocs(collection(d,B+'/candidates'))));
await t('student: read roster (instructors) DENIED', no(getDocs(collection(d,B+'/instructors'))));
await t('student: read archives DENIED', no(getDocs(collection(d,B+'/archives'))));
await t('student: write directory DENIED', no(setDoc(doc(d,B+'/directory/C-101'),{email:'c-999@spc.local'})));
await t('student: create bootstrap DENIED (exists)', no(setDoc(doc(d,B+'/config/bootstrap'),{done:true})));
await t('student: create another user DENIED', no(setDoc(doc(d,B+'/users/zz'),{role:'admin'})));
// --- disabled student
d=db('stuOff');
await t('disabled student: read own evaluation DENIED', no(getDoc(doc(d,B+'/evaluations/e3'))));
// --- instructor
d=db('inst');
await t('instructor: read any profile', ok(getDoc(doc(d,B+'/users/stu'))));
await t('instructor: list profiles', ok(getDocs(collection(d,B+'/users'))));
await t('instructor: promote self to admin DENIED', no(updateDoc(doc(d,B+'/users/inst'),{role:'admin'})));
await t('instructor: create user DENIED', no(setDoc(doc(d,B+'/users/new'),{role:'student',personId:'C-2'})));
await t('instructor: delete user DENIED', no(deleteDoc(doc(d,B+'/users/stu'))));
await t('instructor: list all evaluations', ok(getDocs(collection(d,B+'/evaluations'))));
await t('instructor: create evaluation', ok(setDoc(doc(d,B+'/evaluations/n1'),{id:'C-101',score:5})));
await t('instructor: edit evaluation', ok(updateDoc(doc(d,B+'/evaluations/e2'),{score:9})));
await t('instructor: delete evaluation', ok(deleteDoc(doc(d,B+'/evaluations/n1'))));
await t('instructor: read roster', ok(getDocs(collection(d,B+'/candidates'))));
await t('instructor: write roster DENIED', no(setDoc(doc(d,B+'/candidates/c2'),{n:'z'})));
await t('instructor: delete instructor entry DENIED', no(deleteDoc(doc(d,B+'/instructors/i1'))));
await t('instructor: read/create archives', ok(setDoc(doc(d,B+'/archives/a2'),{x:2})));
await t('instructor: delete archive DENIED', no(deleteDoc(doc(d,B+'/archives/a1'))));
await t('instructor: write directory DENIED', no(setDoc(doc(d,B+'/directory/C-999'),{email:'x@spc.local'})));
await t('instructor: delete bootstrap DENIED', no(deleteDoc(doc(d,B+'/config/bootstrap'))));
await t('instructor w/o disabled field: list evaluations', ok(getDocs(collection(db('legacy'),B+'/evaluations'))));
// --- disabled instructor
d=db('instOff');
await t('disabled instructor: read evaluations DENIED', no(getDocs(collection(d,B+'/evaluations'))));
await t('disabled instructor: write evaluation DENIED', no(setDoc(doc(d,B+'/evaluations/z'),{id:'C-1'})));
// --- admin
d=db('admin');
await t('admin: create user', ok(setDoc(doc(d,B+'/users/new'),{role:'student',personId:'C-2'})));
await t('admin: update user (deactivate)', ok(updateDoc(doc(d,B+'/users/stu2'),{disabled:true})));
await t('admin: delete user', ok(deleteDoc(doc(d,B+'/users/new'))));
await t('admin: write roster', ok(setDoc(doc(d,B+'/candidates/c3'),{n:'q'})));
await t('admin: delete archive', ok(deleteDoc(doc(d,B+'/archives/a1'))));
await t('admin: write directory', ok(setDoc(doc(d,B+'/directory/C-999'),{email:'c-999.2@spc.local'})));
await t('admin: random path DENIED', no(getDoc(doc(d,'secrets/x'))));
// --- first run (no bootstrap)
await seed(false);
await t('first-run: self-create as instructor DENIED', no(setDoc(doc(db('first'),B+'/users/first'),{role:'instructor'})));
await t('first-run: create profile for someone else DENIED', no(setDoc(doc(db('first'),B+'/users/other'),{role:'admin'})));
await t('first-run: self-create Master Admin', ok(setDoc(doc(db('first'),B+'/users/first'),{role:'admin',personId:'ADMIN'})));
await t('first-run: anon create bootstrap DENIED', no(setDoc(doc(db(null),B+'/config/bootstrap'),{done:true})));
await t('first-run: create bootstrap', ok(setDoc(doc(db('first'),B+'/config/bootstrap'),{done:true})));
await t('after setup: second self-made admin DENIED', no(setDoc(doc(db('second'),B+'/users/second'),{role:'admin'})));
await env.cleanup();
console.log(results.join('\n')); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);

import { useCallback, useContext, useEffect, useState } from 'react';
import { userContext } from '../contexts/contexts';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CheckedSvg, LoaderSvg } from '../components/Svgs';

function Home() {
  const { user } = useContext(userContext);
  const uid = user?.uid;
  // console.log(user)

  async function signout() {
    await signOut(auth);
  }

  return (
    <div>
      <div></div>
    </div>
  );
}

export default Home;

const firebase = require('firebase');
import FirebaseConfig from '../constants/ApiKey';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}

const ref = firebase.firestore().collection('Trainer');

// will update the trainers instructors to increase xp and or level
export const wonBattle = (email, singleInstructorInstance, allInstructors) => {
    //updating allInstructors --> deleted the old instance of
    // the instructor we are updating
    console.log('ALL INSTRUCTORS ===>>>>', singleInstructorInstance);
    const updatedAllInstructors = allInstructors.map((instructor) => {
        if (
            instructor.instructorDexId ===
            singleInstructorInstance.instructorDexId
        ) {
            //updating xp
            const currentXp = instructor.xp;
            if (currentXp + 10 >= 100) {
                instructor.xp = 0;
                instructor.level += 1;
            } else {
                instructor.xp += 10;
            }
        }
        return instructor;
    });
    ref.doc(email).update({
        instructors: updatedAllInstructors,
    });
    // console.log(updatedAllInstructors);
};

// will update the trainers instructors to increase xp and or level
export const lostBattle = (email, singleInstructorInstance, allInstructors) => {
    //updating allInstructors --> deleted the old instance of
    // the instructor we are updating
    console.log('LOST BATTLE FUNC HAS BEEN HITT');
    const updatedAllInstructors = allInstructors.map((instructor) => {
        if (
            instructor.instructorDexId ===
            singleInstructorInstance.instructorDexId
        ) {
            //updating xp
            const currentXp = instructor.xp;
            if (currentXp - 10 === 0) {
                instructor.xp = 90;
                instructor.level -= 1;
            } else {
                instructor.xp -= 10;
            }
        }
        return instructor;
    });
    ref.doc(email).update({
        instructors: updatedAllInstructors,
    });
    console.log(updatedAllInstructors);
};

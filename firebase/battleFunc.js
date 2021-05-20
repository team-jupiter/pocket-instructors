const firebase = require('firebase');
const FirebaseConfig = {
    apiKey: 'AIzaSyAWCiOQiacZ3kd_jtIdGl5npTTHRBv_1bA',
    authDomain: 'pocket-instructor-87369.firebaseapp.com',
    databaseURL:
        'https://pocket-instructor-87369-default-rtdb.firebaseio.com',
    projectId: 'pocket-instructor-87369',
    storageBucket: 'pocket-instructor-87369.appspot.com',
    messagingSenderId: '111306351673',
    appId: '1:111306351673:web:323429a94bd60ba7e459e8',
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig);
}

const ref = firebase.firestore().collection('Trainer');

// will update the trainers instructors to increase xp and or level
const wonBattle = (email, singleInstructorInstance, allInstructors) => {
    //updating allInstructors --> deleted the old instance of
    // the instructor we are updating
    const updatedAllInstructors = allInstructors.map((instructor) => {
        if (
            instructor.instructorDexID ===
            singleInstructorInstance.instructorDexID
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
        instructor: updatedAllInstructors,
    });
    console.log(updatedAllInstructors);
};

// will update the trainers instructors to increase xp and or level
const lostBattle = (email, singleInstructorInstance, allInstructors) => {
    //updating allInstructors --> deleted the old instance of
    // the instructor we are updating
    const updatedAllInstructors = allInstructors.map((instructor) => {
        if (
            instructor.instructorDexID ===
            singleInstructorInstance.instructorDexID
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
        instructor: updatedAllInstructors,
    });
    console.log(updatedAllInstructors);
};

//PULLING INSTRUCTORS DOWN FOR TESTING PURPOSES

// let allInstructors = [];
// ref.doc('a@a.com')
//     .get()
//     .then((doc) => {
//         if (doc.exists) {
//             console.log('Document data: INSTRUCTORSSSS --->>>', doc.data());
//             // allInstructors = doc.data();
//         } else {
//             // doc.data() will be undefined in this case
//             console.log('No such document!');
//         }
//     })
//     .catch((error) => {
//         console.log('Error getting document:', error);
//     });

const instructor = {
    // imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/Machamp_XY.gif?alt=media&token=aff56f1c-e0de-47ce-9e94-47d277b5cd6e',
    // xp: 30,
    // level: 1,
    instructorDexID: 1,
    // smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/068.png?alt=media&token=734fd4ce-06dc-446f-8d3c-4778c1a282c7',
    // longitude: 51.52248398195846,
    // hp: 867,
    // instructorName: 'Jon Dagdagan',
    // defense: 67,
    // latitude: 25.39694298059726,
    // attack: 473,
};

const allInstructors = [
    {
        hp: 867,
        instructorName: 'Jon Dagdagan',
        attack: 473,
        smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/068.png?alt=media&token=734fd4ce-06dc-446f-8d3c-4778c1a282c7',
        latitude: 25.39694298059726,
        xp: 10,
        defense: 67,
        longitude: 51.52248398195846,
        instructorDexID: 1,
        l: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/Machamp_XY.gif?alt=media&token=aff56f1c-e0de-47ce-9e94-47d277b5cd6e',
        level: 1,
    },
    {
        hp: 107,
        smlImg: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/068.png?alt=media&token=734fd4ce-06dc-446f-8d3c-4778c1a282c7',
        instructorDexID: 2,
        attack: 174,
        defense: 100,
        longitude: 51.52282638948122,
        imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pocket-instructor-87369.appspot.com/o/Machamp_XY.gif?alt=media&token=aff56f1c-e0de-47ce-9e94-47d277b5cd6e',
        instructorName: 'Not Jon Dagdagan',
        latitude: 25.39582529966849,
    },
];
// wonBattle('a@a.com', instructor, allInstructors);
lostBattle('a@a.com', instructor, allInstructors);

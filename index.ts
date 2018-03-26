import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


export const autoGrader = functions.https.onRequest((request, response) => {
  response.send("Autograder TRIGGERED!!!");
 });

exports.autoGraderStart = functions.database.ref('/Courses/{CourseID}/lectureQuizResponses/{lectureID}/{quizResponse}').onWrite((event) => {
	console.log(event.data.val().quiz);
  	return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/quizzes/' + event.data.val().quiz).once('value').then((snapshot) => {
		
		if(event.data.val().correct === -1){
			return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/lectureQuizResponses/' + event.params.lectureID + '/' + event.params.quizResponse).child('correct').set(snapshot.val().correct === event.data.val().selection).then(() => {	  
				return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/userQuizResponses/' + event.data.val().user +  '/' + event.params.quizResponse).set(event.data.val()).then(() => {
					return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/userQuizResponses/' + event.data.val().user +  '/' + event.params.quizResponse).child('correct').set(snapshot.val().correct === event.data.val().selection).then(() => {
						
					return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/userQuizResponses/' + event.data.val().user +  '/' + event.params.quizResponse).child('quizObj').set(snapshot.val()).then(() => {
						
						return event.data.adminRef.root.child('/Courses/' + event.params.CourseID + '/lectureQuizResponses/' + event.params.lectureID + '/' + event.params.quizResponse).child('quizObj').set(snapshot.val()).then(() => {	  
						console.log("Done");

						});
					});
				});	
			});
		});

		}
		else{
			return event.data.adminRef.root.child('/Example').set({"correct" : true}).then(() => console.log("done"));	
		}
	});

});
































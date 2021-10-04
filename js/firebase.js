const firebaseConfig = {
    apiKey: "AIzaSyBQl-tfOcgtLEvB0gtpvmnU-twYGfXPcvw",
    authDomain: "lateefah-5829b.firebaseapp.com",
    projectId: "lateefah-5829b",
    storageBucket: "lateefah-5829b.appspot.com",
    messagingSenderId: "875251163357",
    appId: "1:875251163357:web:13e0fd98fe648d01af3b34",
    measurementId: "G-QVKM56HN2C"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig)
const database = firebase.database();

// const analytics = getAnalytics(app);

window.onload = function() {
  if (document.getElementById("projectForm")) {
    document.getElementById("projectForm").addEventListener("submit", function(e){
      e.preventDefault(); 

      var projectImage = document.getElementById('projectImage').files[0]
        var projectTitle = document.getElementById('projectTitle').value;
        var projectDesc = document.getElementById('projectDesc').value;
        var role = document.getElementById('role').value   
        var tool = document.getElementById('tool').value         
        var projectCategory = document.getElementById('projectCategory').value
        var detailCategory = document.getElementById('detailCategory').value

        // Create the file metadata
        var metadata = {
          contentType: projectImage.type
        };
        var storageRef = firebase.storage().ref('projects/' + projectImage.name)
        var uploadTask = storageRef.put(projectImage, metadata);

        uploadTask.on("state_changed", // or 'state_changed'
        function(snapshot) {
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
        switch (error.code) {
          case 'storage/unauthorized':
          console.log("unauthorized >> ", error)
            // User doesn't have permission to access the object
            break;
    
          case 'storage/canceled':
          console.log("canceled >> ", error)
            // User canceled the upload
            break;
    
        //   case 'storage/unknown':
//           console.log("unknown >> ", error)
            // Unknown error occurred, inspect error.serverResponse
            break;
        }

      }, function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('projectImage available at', downloadURL);
          
          //console.log("auth >L ", firebaseAuth().getInstance().getCurrentUser())
          // upload to project table
          database.ref('projects').push().set({
            projectImage: downloadURL,
            projectTitle: projectTitle,
            projectDesc : projectDesc,
            role : role,
            tool : tool,
            projectCategory : projectCategory,
            detailCategory: detailCategory
          })
          .then((result) => {
            console.log("Project added successfully => ", result)
          }).catch((error) => {
            console.log("There was an error => ", error)
          });
    
        });
    
      });
      })
    }
  
  }
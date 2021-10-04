window.onload = function () {
    if (document.getElementById("motionForm")) {
        document.getElementById("motionForm").addEventListener("submit", function (e) {
                e.preventDefault();

                var detailImage = document.getElementById('detailImage').files[0]
                var imageCategory = document.getElementById('imageCategory').value

                var metadata = {contentType: detailImage.type};
                var detailStorageRef = firebase.storage().ref('details/' + detailImage.name)
                var task = detailStorageRef.put(detailImage, metadata);

                task.on("state_changed", 
                    function (snapshot) {
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                // document.write("uploading")
                                break;
                    }
                }, function (error) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log("unauthorized >> ", error)
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            console.log("canceled >> ", error)
                            // User canceled the upload
                            break;

                            // case 'storage/unknown':           console.log("unknown >> ", error) Unknown
                            // error occurred, inspect error.serverResponse
                            break;
                    }

                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    task
                        .snapshot
                        .ref
                        .getDownloadURL()
                        .then(function (url) {
                            console.log('Image available at', url);

                            database.ref('details').push().set({
                                detailImage: url,
                                imageCategory: imageCategory
                            })
                                .then((result) => {
                                    console.log("Image added successfully => ", result)
                                    // alert("done")
                                })
                                .catch((error) => {
                                    console.log("There was an error => ", error)
                                });

                        });

                });

            })
    }
}

var detailProject = document.getElementsByClassName('detailProject')[0]
var detailTitle = document.getElementById('detailTitle').innerHTML
var detailDataRef = database.ref('details')

detailDataRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().imageCategory == detailTitle) {
        var childData = childSnapshot.val()
        console.log(childData.detailImage);
        
        var imageCard = document.createElement("div");
        imageCard.className = "imageCard";

        var detailImage = document.createElement('img')
        detailImage.imageSrc = '<img src="' + childData.detailImage + '"/> <br/>'
        console.log(detailImage.imageSrc)

        imageCard.innerHTML = detailImage.imageSrc
        detailProject.appendChild(imageCard);
    }
    })
})


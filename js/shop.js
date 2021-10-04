window.onload = function () {
    if (document.getElementById("shopForm")) {
        document.getElementById("shopForm").addEventListener("submit", function (e) {
                e.preventDefault();

                var shopImage = document.getElementById('shopImage').files[0]
                var shopTitle = document.getElementById('shopTitle').value
                var shopPrice = document.getElementById('shopPrice').value 

                var metadata = {contentType: shopImage.type};
                var shopStorageRef = firebase.storage().ref('shop/' + shopImage.name)
                var task = shopStorageRef.put(shopImage, metadata);

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

                            database.ref('shop').push().set({
                                shopImage: url,
                                shopTitle: shopTitle,
                                shopPrice: shopPrice
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

var shopProject = document.getElementsByClassName('shop')[0]
var shopDataRef = database.ref('shop')

shopDataRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val()
        console.log(childData.shopImage);
        
        var shopCard = document.createElement("div");
        shopCard.className = "shopCard";

        var shopTitle = document.createElement('p')
        shopTitle.innerHTML = childData.shopTitle + '<br />'
            console.log(shopTitle)

            var shopPrice = document.createElement('h6')
            shopPrice.innerHTML = childData.shopPrice + '<br />'
            console.log(shopPrice)

        var shopImage = document.createElement('img')
        shopImage.imageSrc = '<img src="' + childData.shopImage + '"/> <br/>'
        // console.log(detailImage.imageSrc)

        shopCard.innerHTML = shopImage.imageSrc + '<p>' + shopTitle.innerHTML +'</p>' + '<h6>' + shopPrice.innerHTML + '</h6>'

        shopProject.appendChild(shopCard);
    })
})


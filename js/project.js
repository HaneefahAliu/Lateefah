var firebaseProject = document.getElementsByClassName('project')[0]
var pageTitle = document.getElementById('pageTitle').innerHTML
var projectsDataRef = database.ref('projects')

projectsDataRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().projectCategory == pageTitle) {
            var childData = childSnapshot.val()
            // console.log(childData); console.log(childData.role)

            var projectCard = document.createElement("div");
            projectCard.className = "projectCard";

            var projectTitle = document.createElement('h3')
            projectTitle.innerHTML = childData.projectTitle + '<br />'
            // console.log(projectTitle)

            var projectDesc = document.createElement('p')
            projectDesc.innerHTML = childData.projectDesc + '<br />'
            // console.log(projectDesc)

            var role = document.createElement('h6')
            role.innerHTML = childData.role + '<br />'
            // console.log(role)

            var tool = document.createElement('h6')
            tool.innerHTML = childData.tool + '<br />'
            // console.log(tool)

            var projectImage = document.createElement('img')
            projectImage.imageSrc = '<img src="' + childData.projectImage + '"/> <br/>'
            // console.log(tool)

            var detailCategory = document.createElement('a')
            detailCategory.innerHTML = '<a href="' + childData.detailCategory + '.html' +'">View more ↗</a>'
            // console.log(detailCategory)

            projectCard.innerHTML = projectImage.imageSrc + '<h3>' + projectTitle.innerHTML +'</h3>' + '<p>' + projectDesc.innerHTML + '</p>' + '<h6>' + role.innerHTML + '</h6>' + '<h6>' + tool.innerHTML +' </h6>' + detailCategory.innerHTML + '<hr/>'
            console.log(projectCard)

            firebaseProject.appendChild(projectCard);
        }
    })
})


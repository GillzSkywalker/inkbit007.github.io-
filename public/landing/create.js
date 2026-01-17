document.getElementById('create-collection-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Capture the data from the form 
    const CollectionData = document.getElementById('collection-name').value;
    const collectionDescription = document.getElementById('collection-description').value;

    // Simple logic 
   if (collectionName.trim() === "") {
        alert("Please enter a collection name.");
        return;
    }

    console.log("New Collection Create:"); 
    console.log("Name: ", collectionName); 
    console.log("Description: ", collectionDescription);

    // success meessage
    alert(`Success! Your collection "${collectionName}" has been created.`);
});

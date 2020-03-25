// Defines a GraphQL introspection fetcher using the fetch API. You're not required to
// use fetch, and could instead implement introspectionProvider however you like,
// as long as it returns a Promise
// Voyager passes introspectionQuery as an argument for this function
async function introspectionProvider(introspectionQuery) {
   
  const authDetails = getAuthDetails();
  
  return getGQLSchema(introspectionQuery);      
}

function getAuthDetails() {
  const appInstanceName = $("#appinstance").val();
  const username = $("#username").val();
  const password = $("#password").val();

  if (!appInstanceName || !username || !password) {
    console.error('invalid app name or credentials');    
    alert("Invalid app name or credentials");
    return; 
  }
  
  return {
    appInstanceName,
    username,
    password
  }  
}

$("#load").click(async () => {
  
  if (getAuthDetails()) {
    $("#authForm").hide();            

    GraphQLVoyager.init(document.getElementById('voyager'), {
      introspection: introspectionProvider
    });
  }   
  else {      
    alert("Failed to load the diagram of your app! App name or credentials are missing or invalid.")
    window.location.href = '/index.html';    
  }
});
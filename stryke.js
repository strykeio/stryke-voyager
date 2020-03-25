/**
* Will retrieve the GQL schema for a Stryke app. 
* 1. Logs in to the stryke app
* 2. Performs the intrespoction query against the app
* 3. Logs out from Stryke
* 4. Returns the GQL schema
**/
async function getGQLSchema(authDetails, introspectionQuery) {

  try {
    const authToken = await loginStryke(authDetails);

    const appInstanceGQLSchema = await getGraphQLSchemaForStrykeApp(authDetails.appInstanceName, authToken, introspectionQuery);

    await logoutStryke(authDetails.appInstanceName, authToken);

    return await appInstanceGQLSchema.json();
  }
  catch (error) {
    console.error(error.message);
    alert("Failed to load the diagram of your app! Are the app name and credentials correct?")
    window.location.href = '/index.html';     
  }
}

async function loginStryke(authDetails) {
  const loginResponse = await fetch('https://api.stryke.io/v0/' + authDetails.appInstanceName + '/auth/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(authDetails.username + ":" + authDetails.password)
      }
    })

  const authToken = loginResponse.headers.get('Authorization');
  
  if (!authToken) {
    throw new Error('Failed to login to Stryke. Are credentials correct?');
  }

  return authToken;
}

async function logoutStryke(appInstanceName, authToken) {
  
    await fetch('https://api.stryke.io/v0/' + appInstanceName + '/auth/logout', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      }
    })
}

async function getGraphQLSchemaForStrykeApp(appInstanceName, authToken, introspectionQuery) {
  return await fetch('https://api.stryke.io/v0/' + appInstanceName + '/graphiql', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({query: introspectionQuery})
    })
}
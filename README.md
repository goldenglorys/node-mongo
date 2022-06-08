# 1.npm install
install all pacakges for the app 

# 2. add .env file to the root directory
check the **.env.example** file on the root directory and copy the enironment variables to the created **.env** file, then add the PORT you wanted or leave it and the app will switch to PORT **4001**

The **MONGO_ATLAS_PSWD** variable is optional unless you don't have a locally installed MONGODB
The **JWT_SECRET** variable can be set to **fleskai**

# 3. run the app with node index or if you preffer nodemon index

# 4. test the api with what you want, either postman or any client that can perform http operations

**http://localhost:4001/auth/signup**
Change the host, and port if it's different in your devices and that will reruire the **POST** body of JSON object of {firsname,lastname,username,email,age,password} error will return if anything is wrong from the sent request payload, else a success message will return when saved to the database...and don't forget the database is running first if it's storing locally

**http://localhost:4001/auth/login**
Will require email and password used to register else it won't authenticate and after its correct, a token will be sent back and that'll be used to access PROTECTED routes sent along ewith the authorization value in the request headers

**http://localhost:4001/superadmin/allusers**
Get all user but won't return anything unless the token is send together with the request headers (roles that suppose to access it isnt imolemented yet)

**http://localhost:4001/auth/me/userId**
User id will be return with message when registerd, o that will be bind with this GET request to get the details of one specific user, also token must be parse with headers (Access control isnt implemented to here)

**http://localhost:4000/superAdmin/deleteuser/userId**
Delete one specific user base on id also protected eoth token (Acess control of who should perform operation isnt implemented to)

DATA SENT MUST BE IN FORM OF JSON DATATYPE!

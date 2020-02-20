# Bulk-Purchase-App
## Web application based on MERN stack - MongoDB, Express.js, React.js, and Node.js.

## Setup

#### Node

For Linux:
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

For Mac:
```
brew install node
```

#### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).

#### React

```
npm install -g create-react-app
```

## Running the App

Run Mongo daemon:
```
sudo mongod
```
Mongo will be running on port 27017.

To create a database:
```
mongo
``` 
This will open the mongo shell. Type in ```use users``` to create a new database called users.

Run Express:
```
cd backend/
npm install
npm start
```

Run React:
```
cd frontend/
npm install
npm start
```
Navigate to localhost:3000/ in your browser to access the app.


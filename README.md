
# CloudForge CI/CD – Node.js Deployment Pipeline

This project demonstrates a fully automated CI/CD pipeline for a Node.js application using **Jenkins**, **GitHub**, and **AWS EC2**. It showcases how to streamline the software delivery process from code commit to live deployment using DevOps best practices.

## 🔧 Tech Stack
- Node.js
- Git & GitHub
- Jenkins (Freestyle Project)
- AWS EC2

## 🚀 Features
- GitHub integration with webhook triggers
- Jenkins pipeline for build, test, and deploy
- Live deployment on AWS EC2 instance
- End-to-end automation using DevOps practices
  
## 📊 Architecture Overview
1. Developer pushes code to GitHub
2. Webhook triggers Jenkins job
3. Jenkins builds, tests, and deploys the app
4. App is deployed to a live EC2 server






Step 1: Launch EC2 Instance and Enable Port 8080
Create a new EC2 instance (Amazon Linux 2).
In the security group, allow inbound traffic on port 8080 (TCP) for Jenkins.

Step 2: Install Jenkins on EC2
SSH into your EC2 instance and run:
``sudo yum update -y
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install java-17-amazon-corretto -y
sudo yum install jenkins -y
sudo systemctl enable jenkins
sudo service jenkins start
sudo service jenkins status``


Step 3: Unlock Jenkins
Open http://<EC2-Public-IP>:8080 in your browser.
Run the following to get the initial admin password:
#
  sudo cat /var/lib/jenkins/secrets/initialAdminPassword
Complete the setup and click "Start using Jenkins".

Step 4: Connect EC2 to GitHub
Create a folder on EC2 (e.g., nodeapp) and a GitHub repository with the same name.
Configure Git:
#
  git config --global user.name "your_github_username"
  git config --global user.email "your_email@example.com"
  git init
Pull from the template repo and push to your own:
#
  git pull https://github.com/abhay-jadhav-767/jenkins-freestyle-ci-cd-pipeline/
  git push -u origin main

Step 5: Create Jenkins Freestyle Project
In Jenkins, create a new item (e.g., nodeapp) → Freestyle project.
Under Source Code Management, select Git and enter your repo URL.
Save the configuration.

Step 6: Add GitHub Webhook
In your GitHub repo, go to Settings > Webhooks.
Add a webhook:
http://<EC2-Public-IP>:8080/github-webhook/

Step 7: Configure Build Trigger in Jenkins
In your Jenkins project, go to Configure > Build Triggers.
Check GitHub hook trigger for GITScm polling.

Step 8: Test Webhook Integration
Make a change in index.js and push it to GitHub.
Jenkins should automatically detect the change and build the project.

Step 9: Set Up Live Server
Launch another EC2 instance (live server).
Install Node.js and clone the repo:
#
  sudo dnf install git -y
  mkdir nodeapp && cd nodeapp
  git init
  git pull https://github.com/abhay-jadhav-767/nodeapp.git
  sudo yum install nodejs -y
  npm install
  sudo npm install -g pm2
  pm2 start index.js

Step 10: Install NodeJS Plugin in Jenkins
Go to Manage Jenkins > Plugins and install NodeJS Plugin.
Then go to Global Tool Configuration, add NodeJS (e.g., name: mynode), and select the version.


Step 11: Configure Build Environment
In your Jenkins project:
Go to Build Environment.
Enable Provide Node & npm bin/folder to PATH.
In Build Steps, add Execute Shell:
#
  npm install
Save and build the project.

Step 12: Create Test Project in Jenkins
Create a new Jenkins item (e.g., testproject).
Configure:
Source Code Management: GitHub repo URL.
Build Trigger: Build after nodeapp is built and stable.
Build Environment: Provide Node & npm.
Build Steps: Execute Shell:
#
  npm install

Step 13: Add Test Script
In testproject, add another Execute Shell step:
#
  npm install
  ./node_modules/mocha/bin/_mocha --exit ./test/test.js
Push changes to index.js and verify that tests run automatically.

Step 14: Prepare for Deployment
On the live server, ensure PM2 is running.
Enable port 3000 in the security group.
Test the app at http://<Live-Server-IP>:3000.

Step 15: Configure SSH in Jenkins
Install SSH Plugin in Jenkins.
Go to Manage Jenkins > Configure System > SSH remote hosts.
Add a new host:
Hostname: <Live-Server-IP>
Port: 22
Credentials: ec2-user (create if needed)
Test the connection.

Step 16: Create Deployment Job
Create a new Jenkins item (e.g., nodedeploy).
Configure:
Source Code Management: GitHub repo.
Build Steps: Execute shell script on remote host via SSH:
#  
  cd /home/ec2-user/nodeapp
  git pull https://github.com/your_username/nodeapp.git
  sudo npm install -g pm2
  pm2 reload index.js
Set Build Trigger to run after testproject is successful.


Step 17: Final Test
Push changes to index.js
Jenkins should build → test → deploy automatically
Deploy to the live server.

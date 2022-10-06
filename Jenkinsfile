pipeline {
    agent any
    stages{
        stage("Clone Git Repo"){
                steps{
                    git 'https://github.com/osimkhusainov/api-and-ui-cypress'
                }
            }
        stage("Instal Dependencies"){
            steps{
                sh "npm install"
            }
        }
        stage("Run Tests"){
            steps{
                sh "npm run test"
            }
        }
        stage("Publish Allure Report"){
            steps{
                script {
                    allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: 'target/allure-results']]
                    ])
                }
            }
        }
    }
}
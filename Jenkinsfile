pipeline {
    agent any
    tools {nodejs "node"}
    options {
        skipDefaultCheckout(true)
    }
    parameters {
        choice(name: 'SPEC', choices: ['cypress/integration/apiE2E.spec.js', 'cypress/integration/**/**'],  description: 'Ex: cypress/integration/*.spec.js')
        choice(name: 'BROWSER', choices: ['chrome', 'edge', 'firefox'], description: 'Pick the web browser you want to use to run your scripts')
        choice(name: 'BRANCH', choices: ['develop', 'main'])
    }
    stages{
        stage("Clone Git Branch"){
                steps{
                    cleanWs()
                    git branch: '${BRANCH}', credentialsId: '80048f46-2c97-4687-abfe-3b74fae1c005', url: 'https://github.com/osimkhusainov/api-and-ui-cypress'
                } 
        }
        stage("Instal Dependencies"){
            steps{
                sh 'npm install'
            }
        }
        stage("Run Tests"){
            steps{
                sh 'npm run cy:run --browser ${BROWSER} --spec ${SPEC}'
                sh 'npm run posttest'
            }
        }
    }
    post {
        always {
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
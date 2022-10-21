pipeline {
    agent any
    tools {nodejs "node"}
    options {
        skipDefaultCheckout(true)
    }
    parameters {
        string(name: 'SPEC', defaultValue: '**/*.spec.js',  description: 'Ex: cypress/integration/*.spec.js')
        choice(name: 'BROWSER', choices: ['chrome', 'edge', 'firefox'], description: 'Pick the web browser you want to use to run your scripts')
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'BRANCH', type: 'PT_BRANCH'
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
                sh 'npx cypress run --env allure=true --browser ${BROWSER} --spec ${SPEC} --config video=false'
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
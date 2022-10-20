def call(int buildEnv){
    if(buildEnv === "DEVELOP"){
        pipeline {
            agent any
            tools {nodejs "node"}
            options {
                skipDefaultCheckout(true)
            }
            stages{
                stage("Clone Git Develop Branch"){
                        when{
                            branch 'develop'
                        }
                        steps{
                            cleanWs()
                            git branch: 'develop', credentialsId: '80048f46-2c97-4687-abfe-3b74fae1c005', url: 'https://github.com/osimkhusainov/api-and-ui-cypress'
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
    }else{
        pipeline {
            agent any
            tools {nodejs "node"}
            options {
                skipDefaultCheckout(true)
            }
            stages{
                stage("Clone Git Main Branch"){
                        when{
                            branch 'main'
                        }
                        steps{
                            cleanWs()
                            git branch: 'main', credentialsId: '80048f46-2c97-4687-abfe-3b74fae1c005', url: 'https://github.com/osimkhusainov/api-and-ui-cypress'
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
    }
}
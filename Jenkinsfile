pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "/usr/bin/env bash -c '. ~/.bash_profile; yarn install'" },
          "env": { sh "/usr/bin/env bash -c 'env'" }
        )
      }
    }
  }
}

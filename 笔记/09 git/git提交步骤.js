git提交步骤
步骤一：git stash
步骤二：git pull --rebase
步骤三：git stash pop
步骤四：解决冲突
步骤五：git commit提交，可以结合SourceTree的提交按钮，命令行键入格式化的提交日志较难
步骤六：git push origin HEAD:refs/for/develop （gerrit）
git push origin HEAD:refs/for/dev_rms_2.0

git push origin master （getlib）
回滚（git commit或者git push之后，merge之前）：git reset --soft HEAD^ （单次回滚，禁止一次回滚多条）
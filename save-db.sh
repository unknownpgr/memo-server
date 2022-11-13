git checkout database
git rebase master
git add src/prisma/dev.db
git commit -m "Update database at $(date)"
git push
git checkout master

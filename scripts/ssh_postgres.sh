source scripts/env/$1.sh

ssh $POSTGRES_SSH_HOST -l root -p $POSTGRES_SSH_PORT

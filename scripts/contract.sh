#!bin/bash

new() {
  ID_SAS=$1
  FILENAME_CONTRACT="ContratoSAS_$ID_SAS"
  FILE_CONTRACT="../contracts/$FILENAME_CONTRACT.sol"

  LAST_MIGRATION="$(ls ../migrations -1 | wc -l)"
  NEXT_MIGRATION=`expr $LAST_MIGRATION + 1`
  # echo $NEXT_MIGRATION

  FILENAME_MIGRATION="$NEXT_MIGRATION._deploy_contract_$ID_SAS"
  FILE_MIGRATION="../migrations/$FILENAME_MIGRATION.js"

  cp "../contracts/ContratoSAS.sol" $FILE_CONTRACT
  sed -i -e "s/ContratoSAS/$FILENAME_CONTRACT/g" $FILE_CONTRACT
  echo "$FILE_CONTRACT creado y nombres reemplazados"

  cp "../migrations/2_deploy_contracts.js" $FILE_MIGRATION
  sed -i -e "s/ContratoSAS/$FILENAME_CONTRACT/g" $FILE_MIGRATION
  echo "$FILE_MIGRATION creado y nombres reemplazados"

  cd .. & truffle compile & truffle migrate
  echo "Migración finalizada"
}


case "$1" in
new)
  new $2
  ;;
*)
esac
exit $?

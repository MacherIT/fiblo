#!bin/bash

new() {
  ID_SAS=$1
  FILE="../contracts/ContratoSAS_$ID_SAS.sol"

  cp "../contracts/ContratoSAS.sol" $FILE

  echo "$FILE created"
}


case "$1" in
new)
  new $2
  ;;
*)
esac
exit $?

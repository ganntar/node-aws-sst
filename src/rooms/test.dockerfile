npx aws-api-gateway-cli-test \
--username='teste@example.com' \
--password='Senh@123' \
--user-pool-id='us-east-1_v7u6Ntz40' \
--app-client-id='3vblvei4nbjseouml7q3g2ciuv' \
--cognito-region='us-east-1' \
--identity-pool-id='us-east-1:af1963ff-b353-449c-927c-df0792b25974' \
--invoke-url='https://z4tku9su4a.execute-api.us-east-1.amazonaws.com' \
--api-gateway-region='us-east-1' \
--path-template='/rooms' \
--method='POST' \
--body='{"name":"testeRoom", "picture": "fotoRoom"}'

npx aws-api-gateway-cli-test \ 
--username='teste@example.com' \
--password='Senh@123' \
--user-pool-id='us-east-1_v7u6Ntz40' \
--app-client-id='3vblvei4nbjseouml7q3g2ciuv' \
--cognito-region='us-east-1' \
--identity-pool-id='us-east-1:af1963ff-b353-449c-927c-df0792b25974' \
--invoke-url='https://z4tku9su4a.execute-api.us-east-1.amazonaws.com/' \
--api-gateway-region='us-east-1' \
--path-template='/rooms/6ef85e42-a1a3-43bc-b046-05a9d4de771c' \
--method='GET'

npx aws-api-gateway-cli-test --username='teste@example.com' --password='Senh@123' --user-pool-id='us-east-1_v7u6Ntz40' --app-client-id='3vblvei4nbjseouml7q3g2ciuv' --cognito-region='us-east-1' --identity-pool-id='us-east-1:af1963ff-b353-449c-927c-df0792b25974' --invoke-url='https://z4tku9su4a.execute-api.us-east-1.amazonaws.com/' --api-gateway-region='us-east-1' --path-template='/rooms/list/79a3054d-1a00-4e53-98d8-ce3734e2c339/testeroom' --method='GET'
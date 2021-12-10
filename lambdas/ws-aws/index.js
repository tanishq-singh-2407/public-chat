const { ApiGatewayManagementApi, DynamoDB } = require('aws-sdk');

const api = new ApiGatewayManagementApi({ endpoint: 'https://90v2ormm5c.execute-api.ap-south-1.amazonaws.com/test', region: 'ap-south-1' });
const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'ap-south-1' });

const sendMessage = async (ConnectionId, Data) => await api.postToConnection({ ConnectionId, Data }).promise();

exports.handler = async event => {
    const id = event.requestContext.connectionId;

    try {
        switch (event.requestContext.routeKey) {
            case "$connect":
                await dynamo.put({ TableName: 'ws-aws', Item: { id } }).promise();
                break;

            case "$disconnect":
                await dynamo.delete({ TableName: 'ws-aws', Key: { id } }).promise();
                break;

            case "publicMessage":
                const connectionData = await dynamo.scan({ TableName: "ws-aws" }).promise();
                await Promise.all(
                    connectionData.Items.map(
                        async ({ id }) => {
                            await sendMessage(
                                id,
                                JSON.stringify({
                                    name: JSON.parse(event.body).name,
                                    message: JSON.parse(event.body).message
                                })
                            );
                        }
                    )
                );
                break;

            default:
                break;
        };
    } catch (err) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                fromServer: true,
                error: err
            })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            fromServer: true,
            error: false,
            connectionId: event.requestContext.connectionId
        })
    };
};
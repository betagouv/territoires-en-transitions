const getBackendHost = () => {
  if (process.env.REACT_APP_FLAVOR === 'sandbox')
    return 'https://sandboxterritoires.osc-fr1.scalingo.io';
  else if (process.env.REACT_APP_FLAVOR === 'prod')
    return 'https://territoiresentransitions.osc-fr1.scalingo.io';
  else return 'http://localhost:8000';
};

export const ENV = {
  node_env: process.env.NODE_ENV,
  logActionsDuration: process.env.REACT_APP_LOG_ACTION_DURATION === 'TRUE',
  backendHost: getBackendHost(),
};

console.log('ENV :', JSON.stringify(ENV, null, 2));

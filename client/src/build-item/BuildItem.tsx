import { Card } from 'react-bootstrap';
import Layout from '../layout/Layout';

function BuildItem() {
  return (
    <Layout>
      <>
        <h2 className="text-secondary">repo1</h2>
        <Card body>Build #1</Card>
        <pre>
          <code>{`
+ cd client
+ npm install

> core-js@2.6.12 postinstall /drone/src/client/node_modules/babel-runtime/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"


> core-js@3.9.1 postinstall /drone/src/client/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"


> core-js-pure@3.9.1 postinstall /drone/src/client/node_modules/core-js-pure
> node -e "try{require('./postinstall')}catch(e){}"


> ejs@2.7.4 postinstall /drone/src/client/node_modules/ejs
> node ./postinstall.js

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules/webpack-dev-server/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules/watchpack-chokidar2/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

added 1916 packages from 872 contributors and audited 1920 packages in 67.63s

143 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities

+ npm run build

> car-admin@0.1.0 build /drone/src/client
> react-scripts build

Creating an optimized production build...
        `}
          </code>
        </pre>

      </>
    </Layout>

  );
}

export default BuildItem;

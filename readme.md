# Console Plugin

Console plugin for [KubeBrowser operator](https://github.com/kubebrowser/operator)



## Support

Uses PF6 therefore only OpenShift 4.19+ is supported



## Running

To run this locally

1. Login to openshift

```bash
oc login
```

2. Run the start-console script

```
./start-console.sh
```

3. In another terminal start the plugin
   > Dependencies must be installed prior. Run `npm install` for that.

```
npm run start
```

4. Open up http://localhost:9000



## Contributing

You can contribute by:

- Raising any issues you find using the plugin
- Submitting a patch or opening a PR
- Requesting changes or features



## Licensing

This software and its components are licensed under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

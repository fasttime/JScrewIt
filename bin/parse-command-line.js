/* jshint node: true */

'use strict';

module.exports =
    function (argv)
    {
        function parseFeatures()
        {
            var arg = argv[++index];
            if (arg === undefined)
            {
                throw Error('Missing feature list');
            }
            options.features = arg.trim().split(/(?:\s+|\s*\,\s*)/);
        }
        
        function parseSwitch(char)
        {
            switch (char)
            {
            case 'c':
                options.wrapWith = 'call';
                break;
            case 'e':
                options.wrapWith = 'eval';
                break;
            case 't':
                options.trimCode = true;
                break;
            default:
                throw Error('Unrecognized switch ' + JSON.stringify(char));
            }
        }
        
        var inputFileName;
        var outputFileName;
        var options = { };
        
        for (var index = 2; index < argv.length; ++index)
        {
            var arg = argv[index];
            var flag;
            if (/^\-\-/.test(arg))
            {
                flag = arg.slice(2);
                switch (flag)
                {
                case 'features':
                    parseFeatures();
                    break;
                case 'trim-code':
                    options.trimCode = true;
                    break;
                case 'wrap-with-call':
                    options.wrapWith = 'call';
                    break;
                case 'wrap-with-eval':
                    options.wrapWith = 'eval';
                    break;
                default:
                    throw Error('Unrecognized flag ' + JSON.stringify(arg));
                }
            }
            else if (/^\-/.test(arg))
            {
                flag = arg.slice(1);
                if (flag === 'f')
                {
                    parseFeatures();
                }
                else
                {
                    flag.split('').forEach(parseSwitch);
                }
            }
            else
            {
                if (inputFileName)
                {
                    outputFileName = arg;
                }
                else
                {
                    inputFileName = arg;
                }
            }
        }
        
        var result =
            { inputFileName: inputFileName, outputFileName: outputFileName, options: options };
        return result;
    };

import { CLI_PARAMETERS_SPEC } from "../constants.js";
/**
 * Parses the given CLI parameters, this is meant to be used
 * with the `process.argv` array of parameters.
 * @param {string[]} parameters The CLI parameters to be parsed
 * @returns {object} The parsed parameters object
 */
function parse_parameters (parameters) {
    const parsed_parameters = {};
    for (let index = 2; index < parameters.length; index++) {
        let parameter_str = parameters[index];
        if (!CLI_PARAMETERS_SPEC[parameter_str]) { // Might be the verbose version, otherwise will throw an error.
            if (!/^--/.test(parameter_str)) {
                throw new Error("Invalid parameter: " + parameter_str);
            }

            const param_prefix_index = parameters[index].lastIndexOf("-");
            parameter_str = parameters[index].substring(param_prefix_index, param_prefix_index + 2);

            if (!CLI_PARAMETERS_SPEC[parameter_str] || CLI_PARAMETERS_SPEC[parameter_str].verbose !== parameters[index]) {
                throw new Error("Invalid parameter: " + parameters[index]);
            }
        }

        const parameter = CLI_PARAMETERS_SPEC[parameter_str];
        if (parameter.expects_value) {
            if (index + 1 >= parameters.length) {
                throw new Error("Missing value for parameter: " + parameters[index]);
            }
            parsed_parameters[parameter_str] = parameters[++index];
        } else {
            parsed_parameters[parameter_str] = true;
        }
    }

    return parsed_parameters;
}

export default parse_parameters;
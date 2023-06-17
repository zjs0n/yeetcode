const Language = {
    PYTHON: 'PYTHON'
}

const ProblemIOType = {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    DOUBLE: 'DOUBLE',
    CHARACTER: 'CHARACTER',
    BOOLEAN: 'BOOLEAN',
    ARRAY_STRING: 'ARRAY_STRING',
    ARRAY_INTEGER: 'ARRAY_INTEGER',
    ARRAY_DOUBLE: 'ARRAY_DOUBLE',
    ARRAY_CHARACTER: 'ARRAY_CHARACTER',
    ARRAY_BOOLEAN: 'ARRAY_BOOLEAN'
}

const getDefaultCode = (problem, language) => {
    if (language == Language.PYTHON) {
        defaultCodeBuilder = 'from typing import List\n\nclass Solution:\n    def solve(self';
        for (const problemInput of problem['input_type']) {
            defaultCodeBuilder += `, ${problemInput['name']}: ${typeInstantiationToString(problemInput['type'])}`;
        }
        defaultCodeBuilder += `) -> ${typeInstantiationToString(problem['output_type'])}:`;
        defaultCodeBuilder += '\n        ';
        return defaultCodeBuilder;
    }

    return '';
}

const typeInstantiationToString = (ioType) => {
    switch (ioType) {
        case ProblemIOType.STRING:
            return 'str';
        case ProblemIOType.INTEGER:
            return 'int';
        case ProblemIOType.DOUBLE:
            return 'float';
        case ProblemIOType.CHARACTER:
            // Since there is no Python character type, we use a string.
            return 'str';
        case ProblemIOType.BOOLEAN:
            return 'bool';
        case ProblemIOType.ARRAY_STRING:
            return 'List[str]';
        case ProblemIOType.ARRAY_INTEGER:
            return 'List[int]';
        case ProblemIOType.ARRAY_DOUBLE:
            return 'List[float]';
        case ProblemIOType.ARRAY_CHARACTER:
            return 'List[str]';
        case ProblemIOType.ARRAY_BOOLEAN:
            return 'List[bool]';
        default:
            ''
    }
}

module.exports = {
    Language,
    getDefaultCode,
};

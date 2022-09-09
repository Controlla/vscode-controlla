import * as changeCase from "change-case";

export function getFeatureEventTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `part of '${snakeCaseFeatureName}_bloc.dart';

@immutable
abstract class ${pascalCaseFeatureName}Event extends Equatable {}
`;
}
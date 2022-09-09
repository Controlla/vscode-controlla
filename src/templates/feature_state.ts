import * as changeCase from "change-case";

export function getFeatureStateTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `part of '${snakeCaseFeatureName}_bloc.dart';

@immutable
abstract class ${pascalCaseFeatureName}State extends Equatable {
  const ${pascalCaseFeatureName}State();
}

class ${pascalCaseFeatureName}Initial extends ${pascalCaseFeatureName}State {
  @override
  List<Object> get props => [];
}
`;
}
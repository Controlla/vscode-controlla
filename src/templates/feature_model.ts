import * as changeCase from "change-case";

export function getFeatureModelTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'package:flutter/cupertino.dart';
import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/${snakeCaseFeatureName}.dart';

part '${snakeCaseFeatureName}_model.g.dart';

@JsonSerializable(explicitToJson: true)
class ${pascalCaseFeatureName}Model extends ${pascalCaseFeatureName} {
  const ${pascalCaseFeatureName}Model({@required int id}): super(id: id);

  factory ${pascalCaseFeatureName}Model.fromJson(Map<String, dynamic> json) =>
      _$${pascalCaseFeatureName}ModelFromJson(json);

  Map<String, dynamic> toJson() => _$${pascalCaseFeatureName}ModelToJson(this);

  //magic method
  static ${pascalCaseFeatureName}Model fromJsonModel(Map<String, dynamic> json) =>
      ${pascalCaseFeatureName}Model.fromJson(json);
}
`;
}
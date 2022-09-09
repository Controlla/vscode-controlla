import * as changeCase from "change-case";

export function getFeatureEntityTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());

return `import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:json_annotation/json_annotation.dart';

class ${pascalCaseFeatureName} extends Equatable {
  @JsonKey(name: 'id')
  final int id;

  const ${pascalCaseFeatureName}({@required this.id});

  @override
  List<Object> get props => [];
}
`;
}
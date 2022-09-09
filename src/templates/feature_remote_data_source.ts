import * as changeCase from "change-case";

export function getFeatureRemoteDataSourceTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'package:flutter/cupertino.dart';
import '../../../../config/api.dart';
import '../../domain/entities/${snakeCaseFeatureName}.dart';

// ignore: one_member_abstracts
abstract class ${pascalCaseFeatureName}RemoteDataSource {
  Future<${pascalCaseFeatureName}> get${pascalCaseFeatureName}(int id);
}

class ${pascalCaseFeatureName}RemoteDataSourceImpl implements ${pascalCaseFeatureName}RemoteDataSource {
  final Api api;

  ${pascalCaseFeatureName}RemoteDataSourceImpl({@required this.api});

  @override
  Future<${pascalCaseFeatureName}> get${pascalCaseFeatureName}(int id) {
    return api.get${pascalCaseFeatureName}(id: id);
  }
}
`;
}
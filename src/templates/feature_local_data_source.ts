import * as changeCase from "change-case";

export function getFeatureLocalDataSourceTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/utils/constants.dart';
import '../models/${snakeCaseFeatureName}_model.dart';

abstract class ${pascalCaseFeatureName}LocalDataSource {
  Future<${pascalCaseFeatureName}Model> get${pascalCaseFeatureName}(int id);
}

class ${pascalCaseFeatureName}LocalDataSourceImpl implements ${pascalCaseFeatureName}LocalDataSource {
  final FlutterSecureStorage storage;

  ${pascalCaseFeatureName}LocalDataSourceImpl({@required this.storage});

  @override
  Future<${pascalCaseFeatureName}Model> get${pascalCaseFeatureName}(int id) async{
    String jsonStr = await storage.read(key: storageDefaultAuthToken);
    if (jsonStr == null) {
      throw CacheException();
    }
    return ${pascalCaseFeatureName}Model.fromJson(jsonDecode(jsonStr));
  }
}
`;
}
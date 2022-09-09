import * as changeCase from "change-case";

export function getFeatureUseCaseTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/errors/failures.dart';

import '../../../../core/usecases/usecase.dart';
import '../entities/${snakeCaseFeatureName}.dart';
import '../repositories/${snakeCaseFeatureName}_repository.dart';

class Get${pascalCaseFeatureName} implements UseCase<${pascalCaseFeatureName}, ${pascalCaseFeatureName}Params> {
  final ${pascalCaseFeatureName}Repository repository;

  Get${pascalCaseFeatureName}({@required this.repository});

  @override
  Future<Either<Failure, ${pascalCaseFeatureName}>> call(${pascalCaseFeatureName}Params params) async {
    return await repository.get${pascalCaseFeatureName}(params.id);
  }
}

class ${pascalCaseFeatureName}Params extends Equatable {
  final int id;

  const ${pascalCaseFeatureName}Params({@required this.id});

  @override
  List<Object> get props => [];
}
`;
}
import * as changeCase from "change-case";

export function getFeatureRepositoryTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/${snakeCaseFeatureName}.dart';

abstract class ${pascalCaseFeatureName}Repository {
  Future<Either<Failure, ${pascalCaseFeatureName}>> get${pascalCaseFeatureName}(int id);
}
`;
}
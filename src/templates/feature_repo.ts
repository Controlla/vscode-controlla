import * as changeCase from "change-case";

export function getFeatureRepoTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/${snakeCaseFeatureName}.dart';
import '../../domain/repositories/${snakeCaseFeatureName}_repository.dart';
import '../datasources/${snakeCaseFeatureName}_local_datasource.dart';
import '../datasources/${snakeCaseFeatureName}_remote_datasource.dart';

class ${pascalCaseFeatureName}RepositoryImpl implements ${pascalCaseFeatureName}Repository {
  final ${pascalCaseFeatureName}RemoteDataSource remoteDataSource;
  final ${pascalCaseFeatureName}LocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  ${pascalCaseFeatureName}RepositoryImpl(
      {this.remoteDataSource, this.localDataSource, this.networkInfo});

  @override
  Future<Either<Failure, ${pascalCaseFeatureName}>> get${pascalCaseFeatureName}(int id) async {
    try {
      final ${snakeCaseFeatureName} = await localDataSource.get${pascalCaseFeatureName}(id);
      return Right(${snakeCaseFeatureName});
    } on CacheException {
      return Left(CacheFailure());
    }
  }
}
`;
}
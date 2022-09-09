import * as changeCase from "change-case";

export function getFeatureBlocTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());

return `import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../../../core/network/handler_error.dart';
import '../../domain/entities/${snakeCaseFeatureName}.dart';
import '../../domain/usecases/get_${snakeCaseFeatureName}.dart';

part '${snakeCaseFeatureName}_event.dart';
part '${snakeCaseFeatureName}_state.dart';

class ${pascalCaseFeatureName}Bloc extends Bloc<${pascalCaseFeatureName}Event, ${pascalCaseFeatureName}State> {
  final Get${pascalCaseFeatureName} get${pascalCaseFeatureName};

  ${pascalCaseFeatureName}Bloc({@required this.get${pascalCaseFeatureName}})
      : super(${pascalCaseFeatureName}Initial());

  @override
  Stream<${pascalCaseFeatureName}State> mapEventToState(
    ${pascalCaseFeatureName}Event event,
  ) async* {
      //
  }
}
`;
}
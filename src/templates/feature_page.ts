import * as changeCase from "change-case";

export function getFeaturePageTemplate(featureName: string): string {
const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());

return `import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';

class ${pascalCaseFeatureName}Page extends StatefulWidget {
  const ${pascalCaseFeatureName}Page({Key key}) : super(key: key);

  @override
  _${pascalCaseFeatureName}PageState createState() => _${pascalCaseFeatureName}PageState();
}

class _${pascalCaseFeatureName}PageState extends State<${pascalCaseFeatureName}Page> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(translate('app.title')),
      ),
    );
  }
}
`;
}
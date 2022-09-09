import * as _ from 'lodash';
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import { existsSync, lstatSync, writeFile } from "fs";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { getFeatureBlocTemplate, getFeatureEntityTemplate, getFeatureEventTemplate, getFeatureLocalDataSourceTemplate, getFeatureModelTemplate, getFeaturePageTemplate, getFeatureRemoteDataSourceTemplate, getFeatureRepositoryTemplate, getFeatureRepoTemplate, getFeatureStateTemplate, getFeatureUseCaseTemplate } from '../templates';

export const newFeature = async (uri: Uri) => {
    const featureName = await promptForFeatureName();

    if (_.isNil(featureName) || (featureName as string).trim() === "") {
        window.showErrorMessage("The feature name must not be empty");
        return;
    }

    let targetDirectory;
    if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
        targetDirectory = await promptForTargetDirectory();
        if (_.isNil(targetDirectory)) {
            window.showErrorMessage("Please select a valid directory");
            return;
        }
    } else {
    targetDirectory = uri.fsPath;
    }

    if (targetDirectory.split('/').pop() !== 'features') {
      window.showErrorMessage("Please select the features folder");
      return;
    }

    const pascalCaseFeatureName = changeCase.pascalCase((featureName as string).toLowerCase());

    try {
    await generateFeatureCode((featureName as string), targetDirectory);
        window.showInformationMessage(
            `Successfully Generated ${pascalCaseFeatureName} Feature`
    );
    } catch (error) {
        window.showErrorMessage(
            `Error:
            ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
};

function promptForFeatureName(): Thenable<string | undefined> {
    const featureNamePromptOptions: InputBoxOptions = {
        prompt: "Feature Name",
        placeHolder: "Feature Name"
    };
    return window.showInputBox(featureNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Select a folder to create the feature in",
      canSelectFolders: true,
    };
  
    return window.showOpenDialog(options).then((uri) => {
      if (_.isNil(uri) || _.isEmpty(uri) || uri !== undefined) {
        return undefined;
      }
      return (uri as unknown as Uri[])[0].fsPath;
    });
}

async function generateFeatureCode(
    featureName: string,
    targetDirectory: string
  ) {
    const snakeCaseFeatureName = changeCase.snakeCase(featureName.toLowerCase());
    const featureDirectoryPath = `${targetDirectory}/${snakeCaseFeatureName}`;
    if (!existsSync(featureDirectoryPath)) {
      await createDirectory(featureDirectoryPath);
    }
  
    await Promise.all([
      createFeatureDomain(featureName, snakeCaseFeatureName, featureDirectoryPath),
      createFeatureData(featureName, snakeCaseFeatureName, featureDirectoryPath),
      createFeaturePresentation(featureName, snakeCaseFeatureName, featureDirectoryPath),
      //createFeatureStateTemplate(featureName, featureDirectoryPath),
      //createFeatureTemplate(featureName, featureDirectoryPath),
    ]);
  }

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

  async function createFeatureData(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const featureDatasourcesDirectoryPath = `${targetDirectory}/data/datasources`;
    if (!existsSync(featureDatasourcesDirectoryPath)) {
      await createDirectory(featureDatasourcesDirectoryPath);
    }

    const featureModelsDirectoryPath = `${targetDirectory}/data/models`;
    if (!existsSync(featureModelsDirectoryPath)) {
      await createDirectory(featureModelsDirectoryPath);
    }

    const featureRepoDirectoryPath = `${targetDirectory}/data/repositories`;
    if (!existsSync(featureRepoDirectoryPath)) {
      await createDirectory(featureRepoDirectoryPath);
    }

    await Promise.all([
      createFeatureLocalDataSourceTemplate(featureName, snakeCaseFeatureName, featureDatasourcesDirectoryPath),
      createFeatureRemoteDataSourceTemplate(featureName, snakeCaseFeatureName, featureDatasourcesDirectoryPath),
      createFeatureModelTemplate(featureName, snakeCaseFeatureName, featureModelsDirectoryPath),
      createFeatureRepoTemplate(featureName, snakeCaseFeatureName, featureRepoDirectoryPath),
    ]);
  }

  function createFeatureLocalDataSourceTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_local_datasource.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_local_datasource.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureLocalDataSourceTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureRemoteDataSourceTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_remote_datasource.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_remote_datasource.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureRemoteDataSourceTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureModelTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_model.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_model.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureModelTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureRepoTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_repository_impl.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_repository_impl.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureRepoTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  async function createFeatureDomain(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const featureEntitiesDirectoryPath = `${targetDirectory}/domain/entities`;
    if (!existsSync(featureEntitiesDirectoryPath)) {
      await createDirectory(featureEntitiesDirectoryPath);
    }

    const featureRepositoriesDirectoryPath = `${targetDirectory}/domain/repositories`;
    if (!existsSync(featureRepositoriesDirectoryPath)) {
      await createDirectory(featureRepositoriesDirectoryPath);
    }

    const featureUseCasesDirectoryPath = `${targetDirectory}/domain/usecases`;
    if (!existsSync(featureUseCasesDirectoryPath)) {
      await createDirectory(featureUseCasesDirectoryPath);
    }

    await Promise.all([
      createFeatureEntityTemplate(featureName, snakeCaseFeatureName, featureEntitiesDirectoryPath),
      createFeatureRepositoryTemplate(featureName, snakeCaseFeatureName, featureRepositoriesDirectoryPath),
      createFeatureUseCaseTemplate(featureName, snakeCaseFeatureName, featureUseCasesDirectoryPath),
    ]);
  }

  function createFeatureEntityTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureEntityTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureRepositoryTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_repository.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_repository.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureRepositoryTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureUseCaseTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/get_${snakeCaseFeatureName}.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}get_.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureUseCaseTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  async function createFeaturePresentation(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const featureBlocDirectoryPath = `${targetDirectory}/presentation/bloc`;
    if (!existsSync(featureBlocDirectoryPath)) {
      await createDirectory(featureBlocDirectoryPath);
    }

    const featurePagesDirectoryPath = `${targetDirectory}/presentation/pages`;
    if (!existsSync(featurePagesDirectoryPath)) {
      await createDirectory(featurePagesDirectoryPath);
    }

    const featureWidgetsDirectoryPath = `${targetDirectory}/presentation/widgets`;
    if (!existsSync(featureWidgetsDirectoryPath)) {
      await createDirectory(featureWidgetsDirectoryPath);
    }

    await Promise.all([
      createFeatureBlocTemplate(featureName, snakeCaseFeatureName, featureBlocDirectoryPath),
      createFeatureEventTemplate(featureName, snakeCaseFeatureName, featureBlocDirectoryPath),
      createFeatureStateTemplate(featureName, snakeCaseFeatureName, featureBlocDirectoryPath),
      createFeaturePageTemplate(featureName, snakeCaseFeatureName, featurePagesDirectoryPath),
    ]);
  }

  function createFeatureBlocTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_bloc.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_bloc.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureBlocTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureEventTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_event.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_event.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureEventTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeatureStateTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}_state.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}_state.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeatureStateTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  function createFeaturePageTemplate(
    featureName: string,
    snakeCaseFeatureName: string,
    targetDirectory: string
  ) {
    const targetPath = `${targetDirectory}/${snakeCaseFeatureName}.dart`;
    if (existsSync(targetPath)) {
      throw Error(`${snakeCaseFeatureName}.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
      writeFile(
        targetPath,
        getFeaturePageTemplate(featureName),
        "utf8",
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }
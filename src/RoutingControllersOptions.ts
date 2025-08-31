import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { AuthorizationChecker } from './AuthorizationChecker';
import { CurrentUserChecker } from './CurrentUserChecker';
import { Newable, Callable } from './types/Types';

/**
 * Routing controller initialization options.
 */
export interface RoutingControllersOptions {
  /**
   * Indicates if cors are enabled.
   * This requires installation of additional module (cors for express and @koa/cors for koa).
   */
  cors?: boolean | Record<string, unknown>;

  /**
   * Global route prefix, for example '/api'.
   */
  routePrefix?: string;

  /**
   * List of controllers to register in the framework or directories from where to import all your controllers.
   */
  controllers?: Newable[] | string[];

  /**
   * List of middlewares to register in the framework or directories from where to import all your middlewares.
   */
  middlewares?: Newable[] | string[];

  /**
   * List of interceptors to register in the framework or directories from where to import all your interceptors.
   */
  interceptors?: Newable[] | string[];

  /**
   * Indicates if class-transformer should be used to perform serialization / deserialization.
   */
  classTransformer?: boolean;

  /**
   * Global class transformer options passed to class-transformer during classToPlain operation.
   * This operation is being executed when server returns response to user.
   */
  classToPlainTransformOptions?: ClassTransformOptions;

  /**
   * Global class transformer options passed to class-transformer during plainToClass operation.
   * This operation is being executed when parsing user parameters.
   */
  plainToClassTransformOptions?: ClassTransformOptions;

  /**
   * Indicates if class-validator should be used to auto validate objects injected into params.
   * You can also directly pass validator options to enable validator with a given options.
   */
  validation?: boolean | ValidatorOptions;

  /**
   * Indicates if development mode is enabled.
   * By default its enabled if your NODE_ENV is not equal to "production".
   */
  development?: boolean;

  /**
   * Indicates if default routing-controller's error handler is enabled or not.
   * Enabled by default.
   */
  defaultErrorHandler?: boolean;

  /**
   * Map of error overrides.
   */
  errorOverridingMap?: { [key: string]: any };

  /**
   * Special function used to check user authorization roles per request.
   * Must return true or promise with boolean true resolved for authorization to succeed.
   */
  authorizationChecker?: AuthorizationChecker;

  /**
   * Special function used to get currently authorized user.
   */
  currentUserChecker?: CurrentUserChecker;

  /**
   * Express specific options.
   */
  express?: {
    /**
     * Set the express query parser type or disable it. 
     * https://expressjs.com/en/5x/api.html#app.settings.table
     * 
     * 'simple' - uses the simple query parser (http://nodejs.org/api/querystring.html)
     * 'extended' - uses the qs module for parsing (https://www.npmjs.org/package/qs)
     * Callable - a custom query parser function
     * false - to disable query parsing altogether
     * 
     * Note: The default express setting is 'simple'.
     * In order to support complex query params (like arrays) out of the box,
     * this option is set to 'extended' by default.
     * 
     * Default: 'extended'
     * 
     * @see
     */
    queryParser?: 'simple' | 'extended' | Callable | false;
  }

  /**
   * Default settings
   */
  defaults?: {
    /**
     * If set, all null responses will return specified status code by default
     */
    nullResultCode?: number;

    /**
     * If set, all undefined responses will return specified status code by default
     */
    undefinedResultCode?: number;

    /**
     * Default param options
     */
    paramOptions?: {
      /**
       * If true, all non-set parameters will be required by default
       */
      required?: boolean;
    };
  };
}

import { ControllerMetadataArgs } from '../metadata/args/ControllerMetadataArgs';
import { ActionMetadataArgs } from '../metadata/args/ActionMetadataArgs';
import { ParamMetadataArgs } from '../metadata/args/ParamMetadataArgs';
import { ResponseHandlerMetadataArgs } from '../metadata/args/ResponseHandleMetadataArgs';
import { MiddlewareMetadataArgs } from '../metadata/args/MiddlewareMetadataArgs';
import { UseMetadataArgs } from '../metadata/args/UseMetadataArgs';
import { UseInterceptorMetadataArgs } from '../metadata/args/UseInterceptorMetadataArgs';
import { InterceptorMetadataArgs } from '../metadata/args/InterceptorMetadataArgs';
import { Newable } from '../types/Types';

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Registered controller metadata args.
   */
  controllers: ControllerMetadataArgs[] = [];

  /**
   * Registered middleware metadata args.
   */
  middlewares: MiddlewareMetadataArgs[] = [];

  /**
   * Registered interceptor metadata args.
   */
  interceptors: InterceptorMetadataArgs[] = [];

  /**
   * Registered "use middleware" metadata args.
   */
  uses: UseMetadataArgs[] = [];

  /**
   * Registered "use interceptor" metadata args.
   */
  useInterceptors: UseInterceptorMetadataArgs[] = [];

  /**
   * Registered action metadata args.
   */
  actions: ActionMetadataArgs[] = [];

  /**
   * Registered param metadata args.
   */
  params: ParamMetadataArgs[] = [];

  /**
   * Registered response handler metadata args.
   */
  responseHandlers: ResponseHandlerMetadataArgs[] = [];

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Filters registered middlewares by a given classes.
   */
  filterMiddlewareMetadatasForClasses(classes: Newable[]): MiddlewareMetadataArgs[] {
    return classes.map(cls => this.middlewares.find(mid => mid.target === cls)).filter(midd => midd !== undefined); // this might be not needed if all classes where decorated with `@Middleware`
  }

  /**
   * Filters registered interceptors by a given classes.
   */
  filterInterceptorMetadatasForClasses(classes: Newable[]): InterceptorMetadataArgs[] {
    return this.interceptors.filter(ctrl => {
      return classes.filter(cls => ctrl.target === cls).length > 0;
    });
  }

  /**
   * Filters registered controllers by a given classes.
   */
  filterControllerMetadatasForClasses(classes: Newable[]): ControllerMetadataArgs[] {
    return this.controllers.filter(ctrl => {
      return classes.filter(cls => ctrl.target === cls).length > 0;
    });
  }

  /**
   * Filters registered actions by a given classes.
   */
  filterActionsWithTarget(target: Newable): ActionMetadataArgs[] {
    return this.actions.filter(action => action.target === target);
  }

  /**
   * Filters registered "use middlewares" by a given target class and method name.
   */
  filterUsesWithTargetAndMethod(target: Newable, methodName?: string): UseMetadataArgs[] {
    return this.uses.filter(use => {
      return use.target === target && use.method === methodName;
    });
  }

  /**
   * Filters registered "use interceptors" by a given target class and method name.
   */
  filterInterceptorUsesWithTargetAndMethod(target: Newable, methodName?: string): UseInterceptorMetadataArgs[] {
    return this.useInterceptors.filter(use => {
      return use.target === target && use.method === methodName;
    });
  }

  /**
   * Filters parameters by a given classes.
   */
  filterParamsWithTargetAndMethod(target: Newable, methodName: string): ParamMetadataArgs[] {
    return this.params.filter(param => {
      return param.object.constructor === target && param.method === methodName;
    });
  }

  /**
   * Filters response handlers by a given class.
   */
  filterResponseHandlersWithTarget(target: Newable): ResponseHandlerMetadataArgs[] {
    return this.responseHandlers.filter(property => {
      return property.target === target;
    });
  }

  /**
   * Filters response handlers by a given classes.
   */
  filterResponseHandlersWithTargetAndMethod(target: Newable, methodName: string): ResponseHandlerMetadataArgs[] {
    return this.responseHandlers.filter(property => {
      return property.target === target && property.method === methodName;
    });
  }

  /**
   * Removes all saved metadata.
   */
  reset() {
    this.controllers = [];
    this.middlewares = [];
    this.interceptors = [];
    this.uses = [];
    this.useInterceptors = [];
    this.actions = [];
    this.params = [];
    this.responseHandlers = [];
  }
}

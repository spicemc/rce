import { getMetadataArgsStorage } from '../index';
import { Action } from '../Action';
import { Newable, Callable, ClassType } from '@rce/types/Types';

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Newable>): Callable;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<(action: Action, result: any) => any>): Callable;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Newable | ((action: Action, result: any) => any)>): Callable {
  return function (objectOrFunction: Newable | Callable, methodName?: string) {
    interceptors.forEach(interceptor => {
      getMetadataArgsStorage().useInterceptors.push({
        interceptor: interceptor,
        target: methodName ? objectOrFunction.constructor : (objectOrFunction as Callable),
        method: methodName,
      });
    });
  };
}

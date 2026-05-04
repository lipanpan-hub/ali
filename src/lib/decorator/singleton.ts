/**
 * 单例模式装饰器
 * 确保被装饰的类只能创建一个实例
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Singleton<T extends new (...args: any[]) => any>(constructor: T): T {
  // 使用闭包保存单例实例
  let instance: InstanceType<T> | undefined;

  // 创建代理构造函数
  const proxy: T = new Proxy(constructor, {
    construct(target, args): object {
      // 如果实例已存在，返回已有实例
      if (instance) {
        return instance;
      }

      // 否则创建新实例并保存
      instance = Reflect.construct(target, args) as InstanceType<T>;
      return instance!;
    },
  }) as T;

  return proxy;
}

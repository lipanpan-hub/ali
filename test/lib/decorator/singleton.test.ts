import {expect} from 'chai'

import {Singleton} from '../../../src/lib/decorator/singleton.js'

describe('Singleton 装饰器', () => {
  it('应该确保类只创建一个实例', () => {
    // 使用装饰器装饰类
    @Singleton
    class TestClass {
      public value: string

      constructor(value: string) {
        this.value = value
      }
    }

    // 创建两个实例
    const instance1 = new TestClass('first')
    const instance2 = new TestClass('second')

    // 验证是同一个实例
    expect(instance1).to.equal(instance2)
    // 验证值保持为第一次创建时的值
    expect(instance1.value).to.equal('first')
    expect(instance2.value).to.equal('first')
  })

  it('应该支持不同的类有不同的单例实例', () => {
    @Singleton
    class ClassA {
      public name = 'A'
    }

    @Singleton
    class ClassB {
      public name = 'B'
    }

    const instanceA1 = new ClassA()
    const instanceA2 = new ClassA()
    const instanceB1 = new ClassB()
    const instanceB2 = new ClassB()

    // 同一个类的实例应该相同
    expect(instanceA1).to.equal(instanceA2)
    expect(instanceB1).to.equal(instanceB2)

    // 不同类的实例应该不同
    expect(instanceA1).to.not.equal(instanceB1)
  })

  it('应该保持类的原型链', () => {
    @Singleton
    class TestClass {
      public getValue(): string {
        return 'test'
      }
    }

    const instance = new TestClass()

    // 验证方法可以正常调用
    expect(instance.getValue()).to.equal('test')
    // 验证 instanceof 正常工作
    expect(instance).to.be.instanceOf(TestClass)
  })
})

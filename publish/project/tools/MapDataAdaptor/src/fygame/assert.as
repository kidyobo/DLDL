package fygame
{

	/**
	 * <p>断言的伪实现。</p>
	 *     <p>断言仅为测试用途，断言的代码是不应该在发行版中出现的。因此使用断言应遵循下面的
	 * 格式，否则无法通过发行版的编译。</p>
	 * <p><code>CONFIG::debug{assert(condition);}</code></p>
	 * @author fygame
	 */
	public function assert(express:Boolean, message:String = null):void
	{
		if (!express)
		{
			if (!message)
				message = "assert Exception!!!"
			throw new Error(message);
		}
	}
}


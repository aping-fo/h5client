using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//z自我检测题库(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class SelfTestCfg : RawData
	{
		public ObscuredInt id;//ID
		public string content;//题目内容
		public string contentImgUrl;//题目图片路径
		public string[] options;//选项
		public ObscuredInt catergory;//分类
		public int[] score;//得分

		public SelfTestCfg()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			content = bb.GetString();
			contentImgUrl = bb.GetString();
			options = SerializeHelper.GetString1(bb);
			catergory = bb.Get7BitEncodeInt();
			score = SerializeHelper.Get7BitEncodeInt1(bb);

			if (DeserializeHelper.OnSelfTestCfgDecode != null)
			{
				DeserializeHelper.OnSelfTestCfgDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.PutString(content);
			bb.PutString(contentImgUrl);
			SerializeHelper.PutString1(bb,options);
			bb.Put7BitEncodeInt(catergory);
			SerializeHelper.Put7BitEncodeInt1(bb,score);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}

using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//q全局配置表(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class GlobalConfig : RawData
	{
		public ObscuredInt id;//Key
		public ObscuredInt maxRoleCount;//创建角色上限

		public GlobalConfig()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			maxRoleCount = bb.Get7BitEncodeInt();

			if (DeserializeHelper.OnGlobalConfigDecode != null)
			{
				DeserializeHelper.OnGlobalConfigDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.Put7BitEncodeInt(maxRoleCount);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}
